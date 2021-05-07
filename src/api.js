import { DoesNotExistError } from "./types/internalErrors.js";
import { getObjectKeys, removeDoubleSlash } from "./utils.js";
import { pageState } from "./globalPageState.js";

function getHeaders() {
  return {
    "X-Vault-Token": pageState.token,
  }
}

const appendAPIURL = (url) => pageState.apiURL + url;

export async function lookupSelf() {
  const request = new Request(appendAPIURL("/v1/auth/token/lookup-self"), {
    headers: getHeaders(),
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
  const request = new Request(appendAPIURL("/v1/auth/token/renew-self"), {
    method: 'POST',
    headers: {
      ...getHeaders(),
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

export async function sealVault() {
  const request = new Request(appendAPIURL("/v1/sys/seal"), {
    method: 'PUT',
    headers: getHeaders(),
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
  const request = new Request(appendAPIURL(`/v1/auth/userpass/login/${username}`), {
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
  const request = new Request(appendAPIURL("/v1/sys/internal/ui/mounts"), {
    headers: getHeaders(),
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.data.secret;
  });
}

export async function getSealStatus() {
  const request = new Request(appendAPIURL("/v1/sys/seal-status"));
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data;
  });
}

export async function submitUnsealKey(key) {
  const request = new Request(appendAPIURL("/v1/sys/unseal"), {
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
  return await getCapabilitiesPath(removeDoubleSlash(baseMount + secretPath.join("/") + "/" + name))
}

export async function getCapabilitiesPath(path) {
  const request = new Request(appendAPIURL("/v1/sys/capabilities-self"), {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify(
      {
        "paths": [removeDoubleSlash(path)]
      }
    )
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.capabilities;
  });
}

export async function getSecrets(baseMount, mountType, secretPath) {
  let secretURL = "";
  if (mountType == "kv-v2") {
    secretURL = `/v1/${baseMount}/metadata/${secretPath.join("")}?list=true`;
  } else {
    // cubbyhole and v1 are identical
    secretURL = `/v1/${baseMount}/${secretPath.join("")}?list=true`;
  }
  const request = new Request(appendAPIURL(secretURL), {
    headers: getHeaders(),
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
  const request = new Request(appendAPIURL(`/v1/${baseMount}/metadata/${secretPath.join("")}/${name}`), {
    headers: getHeaders(),
  });

  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.data;
  });
}

export async function undeleteSecret(baseMount, secretPath, name, version = null) {
  let secretURL = `/v1/${baseMount}/undelete/${secretPath.join("/")}/${name}`;
  secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
  if (version == null) {
    let meta = await getSecretMetadata(
      baseMount,
      secretPath,
      name
    );
    let versions = getObjectKeys(meta.versions);
    version = String(versions[versions.length-1]);
  }

  let request = new Request(appendAPIURL(secretURL), {
    method: "POST",
    headers: {
      ...getHeaders(),
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


export async function getSecret(baseMount, mountType, secretPath, name, version = null) {
  let secretURL = "";
  if (mountType == "kv-v2") {
    secretURL = `/v1/${baseMount}/data/${secretPath.join("")}/${name}`;
    if (version != null) secretURL += `?version=${version}`;
  } else {
    secretURL = `/v1/${baseMount}/${secretPath.join("")}/${name}`;
  }
  const request = new Request(appendAPIURL(secretURL), {
    headers: getHeaders(),
  });

  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return mountType == "kv-v2" ? data.data.data : data.data;
  });
}

export async function deleteSecret(baseMount, mountType, secretPath, name, version = null) {
  let secretURL = "";

  let request;

  if (mountType == "kv-v2" && version != null) {
    secretURL = `/v1/${baseMount}/delete/${secretPath.join("")}/${name}`;
    secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
    request = new Request(appendAPIURL(secretURL), {
      method: "POST",
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: version != null ? JSON.stringify({ "versions": [version] }) : "{}"
    });
  } else {
    if (mountType == "kv-v2") {
      secretURL = `/v1/${baseMount}/metadata/${secretPath.join("")}/${name}`;
    } else {
      secretURL = `/v1/${baseMount}/${secretPath.join("")}/${name}`;
    }
    secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
    request = new Request(appendAPIURL(secretURL), {
      method: "DELETE",
      headers: getHeaders(),
    });
  }


  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  }
}

export async function createOrUpdateSecret(baseMount, mountType, secretPath, name, data) {
  let secretURL = "";
  let APIData = {};

  if (mountType == "kv-v2") {
    secretURL = `/v1/${baseMount}/data/${secretPath.join("/")}/${name}`;
    APIData = { "data": data };
  } else {
    secretURL = `/v1/${baseMount}/${secretPath.join("/")}/${name}`;
    APIData = data;
  }

  secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
  const request = new Request(appendAPIURL(secretURL), {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
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
  const request = new Request(appendAPIURL(`/v1/${baseMount}/keys?list=true`), {
    headers: getHeaders(),
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
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/encrypt/${name}`)), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
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
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/decrypt/${name}`)), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
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
  const request = new Request(appendAPIURL(`/v1/${baseMount}/keys?list=true`), {
    headers: getHeaders(),
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

export async function getTOTPCode(baseMount, name) {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/code/${name}`), {
    headers: getHeaders(),
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.data.code;
  });
}

export async function addNewTOTP(baseMount, parms) {
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/keys/${parms.name}`)), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify(parms)
  });
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  }
}
