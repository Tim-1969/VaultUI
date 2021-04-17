
import { getAPIURL, getToken, removeDoubleSlash } from "./utils.js";

export const DoesNotExistError = new Error("Does not exist.");

export async function lookupSelf() {
  const request = new Request(getAPIURL() + "/v1/auth/token/lookup-self", {
    headers: {
      "X-Vault-Token": getToken(),
    }
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    if ("data" in data) {
      return data.data;
    } else if ("errors" in data) {
      throw new Error(data.errors[0]);
    }
  });
}

export async function renewSelf() {
  const request = new Request(getAPIURL() + "/v1/auth/token/renew-self", {
    method: 'POST',
    headers: {
      "X-Vault-Token": getToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    if ("errors" in data) {
      throw new Error(data.errors[0]);
    }
  });
}

export async function usernameLogin(username, password) {
  const request = new Request(getAPIURL() + `/v1/auth/userpass/login/${username}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "username": username, "password": password })
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    if ("auth" in data) {
      return data.auth.client_token;
    } else if ("errors" in data) {
      throw new Error(data.errors[0]);
    }
  });
}

export async function getMounts() {
  const request = new Request(getAPIURL() + "/v1/sys/internal/ui/mounts", {
    headers: {
      "X-Vault-Token": getToken(),
    }
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.data.secret;
  });
}

export async function getSealStatus() {
  const request = new Request(getAPIURL() + "/v1/sys/seal-status");
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data;
  });
}

export async function submitUnsealKey(key) {
  const request = new Request(getAPIURL() + "/v1/sys/unseal", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "key": key
    })
  });
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  }
}

export async function getCapabilities(baseMount, secretPath, name) {
  const request = new Request(getAPIURL() + "/v1/sys/capabilities-self", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "X-Vault-Token": getToken(),
    },
    body: JSON.stringify(
      {
        "paths": [removeDoubleSlash(baseMount + secretPath.join("/") + "/" + name)]
      }
    )
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.capabilities;
  });
}

export async function getSecrets(baseMount, secretPath) {
  let secretURL = "";
  if (pageState.currentMountType == "kv-v2") {
    secretURL = `/v1/${baseMount}/metadata/${secretPath.join("")}?list=true`;
  } else {
    // cubbyhole and v1 are identical
    secretURL = `/v1/${baseMount}/${secretPath.join("")}?list=true`;
  }
  const request = new Request(getAPIURL() + secretURL, {
    headers: {
      "X-Vault-Token": getToken(),
    }
  });
  return fetch(request).then(response => {
    if (response.status == 404) {
      throw DoesNotExistError;
    }
    return response.json();
  }).then(data => {
    return data.data.keys;
  });

}

export async function getSecretMetadata(baseMount, secretPath, name) {
  const request = new Request(getAPIURL() + `/v1/${baseMount}/metadata/${secretPath.join("")}/${name}`, {
    headers: {
      "X-Vault-Token": getToken(),
    }
  });

  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.data;
  });
}

export async function undeleteSecret(baseMount, secretPath, name, version) {
  let secretURL = `/v1/${baseMount}/undelete/${secretPath.join("")}/${name}`;
  secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
  let request = new Request(getAPIURL() + secretURL, {
    method: "POST",
    headers: {
      'X-Vault-Token': getToken(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "versions": [version] })
  });
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  }
}


export async function getSecret(baseMount, secretPath, name, version = "0") {
  let secretURL = "";
  if (pageState.currentMountType == "kv-v2") {
    secretURL = `/v1/${baseMount}/data/${secretPath.join("")}/${name}`;
    if (version != 0) secretURL += `?version=${version}`;
  } else {
    secretURL = `/v1/${baseMount}/${secretPath.join("")}/${name}`;
  }
  const request = new Request(getAPIURL() + secretURL, {
    headers: {
      "X-Vault-Token": getToken(),
    }
  });

  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return pageState.currentMountType == "kv-v2" ? data.data.data : data.data;
  });
}

export async function deleteSecret(baseMount, secretPath, name, version) {
  let secretURL = "";

  let request;

  if (pageState.currentMountType == "kv-v2" && version != "0") {
    secretURL = `/v1/${baseMount}/delete/${secretPath.join("")}/${name}`;
    secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
    request = new Request(getAPIURL() + secretURL, {
      method: "POST",
      headers: {
        'X-Vault-Token': getToken(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "versions": [version] })
    });
  } else {
    if (pageState.currentMountType == "kv-v2") {
      secretURL = `/v1/${baseMount}/metadata/${secretPath.join("")}/${name}`;
    } else {
      secretURL = `/v1/${baseMount}/${secretPath.join("")}/${name}`;
    }
    secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
    request = new Request(getAPIURL() + secretURL, {
      method: "DELETE",
      headers: {
        'X-Vault-Token': getToken()
      },
    });
  }


  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  }
}

export async function createOrUpdateSecret(baseMount, secretPath, name, data) {
  let secretURL = "";
  let APIData = {};

  if (pageState.currentMountType == "kv-v2") {
    secretURL = `/v1/${baseMount}/data/${secretPath.join("")}/${name}`;
    APIData = { "data": data };
  } else {
    secretURL = `/v1/${baseMount}/${secretPath.join("")}/${name}`;
    APIData = data;
  }

  secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
  const request = new Request(getAPIURL() + secretURL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'X-Vault-Token': getToken()
    },
    body: JSON.stringify(APIData, null, 0)
  });
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  }
}

export async function getTransitKeys(baseMount) {
  const request = new Request(getAPIURL() + `/v1/${baseMount}/keys?list=true`, {
    headers: {
      "X-Vault-Token": getToken(),
    }
  });
  return fetch(request).then(response => {
    if (response.status == 404) {
      throw DoesNotExistError;
    }
    return response.json();
  }).then(data => {
    return data.data.keys;
  });
}

export async function transitEncrypt(baseMount, name, data) {
  const request = new Request(getAPIURL() + removeDoubleSlash(`/v1/${baseMount}/encrypt/${name}`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Vault-Token': getToken()
    },
    body: JSON.stringify({plaintext: data})
  });
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  } else {
    let json = await response.json();
    return json.data;
  }
}

export async function transitDecrypt(baseMount, name, data) {
  const request = new Request(getAPIURL() + removeDoubleSlash(`/v1/${baseMount}/decrypt/${name}`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Vault-Token': getToken()
    },
    body: JSON.stringify({ciphertext: data})
  });
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  } else {
    let json = await response.json();
    return json.data;
  }
}


export async function getTOTPKeys(baseMount) {
  const request = new Request(getAPIURL() + `/v1/${baseMount}/keys?list=true`, {
    headers: {
      "X-Vault-Token": getToken(),
    }
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.data.keys;
  });
}

export async function getTOTPCode(baseMount, name) {
  const request = new Request(getAPIURL() + `/v1/${baseMount}/code/${name}`, {
    headers: {
      "X-Vault-Token": getToken(),
    }
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.data.code;
  });
}

export async function addNewTOTP(baseMount, parms) {
  const request = new Request(getAPIURL() + removeDoubleSlash(`/v1/${baseMount}/keys/${parms.name}`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Vault-Token': getToken()
    },
    body: JSON.stringify(parms)
  });
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  }
}
