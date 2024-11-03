import { API_BASE_URL } from '../utils/constants';
import { apiCall } from './authApi';

export const fetchLastWorkspaceId = async () => {
  const response = await apiCall(`${API_BASE_URL}/workspaces/last`);
  return response.json();
};

export const fetchFileList = async (workspaceId) => {
  const response = await apiCall(
    `${API_BASE_URL}/workspaces/${workspaceId}/files`
  );
  return response.json();
};

export const fetchFileContent = async (workspaceId, filePath) => {
  const response = await apiCall(
    `${API_BASE_URL}/workspaces/${workspaceId}/files/${filePath}`
  );
  return response.text();
};

export const saveFileContent = async (workspaceId, filePath, content) => {
  const response = await apiCall(
    `${API_BASE_URL}/workspaces/${workspaceId}/files/${filePath}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: content,
    }
  );
  return response.text();
};

export const deleteFile = async (workspaceId, filePath) => {
  const response = await apiCall(
    `${API_BASE_URL}/workspaces/${workspaceId}/files/${filePath}`,
    {
      method: 'DELETE',
    }
  );
  return response.text();
};

export const getWorkspace = async (workspaceId) => {
  const response = await apiCall(`${API_BASE_URL}/workspaces/${workspaceId}`);
  return response.json();
};

// Combined function to update workspace data including settings
export const updateWorkspace = async (workspaceId, workspaceData) => {
  const response = await apiCall(`${API_BASE_URL}/workspaces/${workspaceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workspaceData),
  });
  return response.json();
};

export const pullChanges = async (workspaceId) => {
  const response = await apiCall(
    `${API_BASE_URL}/workspaces/${workspaceId}/git/pull`,
    {
      method: 'POST',
    }
  );
  return response.json();
};

export const commitAndPush = async (workspaceId, message) => {
  const response = await apiCall(
    `${API_BASE_URL}/workspaces/${workspaceId}/git/commit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    }
  );
  return response.json();
};

export const getFileUrl = (workspaceId, filePath) => {
  return `${API_BASE_URL}/workspaces/${workspaceId}/files/${filePath}`;
};

export const lookupFileByName = async (workspaceId, filename) => {
  const response = await apiCall(
    `${API_BASE_URL}/workspaces/${workspaceId}/files/lookup?filename=${encodeURIComponent(
      filename
    )}`
  );
  const data = await response.json();
  return data.paths;
};

export const updateLastOpenedFile = async (workspaceId, filePath) => {
  const response = await apiCall(
    `${API_BASE_URL}/workspaces/${workspaceId}/files/last`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filePath }),
    }
  );
  return response.json();
};

export const getLastOpenedFile = async (workspaceId) => {
  const response = await apiCall(
    `${API_BASE_URL}/workspaces/${workspaceId}/files/last`
  );
  return response.json();
};

export const listWorkspaces = async () => {
  const response = await apiCall(`${API_BASE_URL}/workspaces`);
  return response.json();
};

export const createWorkspace = async (name) => {
  const response = await apiCall(`${API_BASE_URL}/workspaces`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  return response.json();
};

export const deleteWorkspace = async (workspaceId) => {
  const response = await apiCall(`${API_BASE_URL}/workspaces/${workspaceId}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const updateLastWorkspace = async (workspaceId) => {
  const response = await apiCall(`${API_BASE_URL}/workspaces/last`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workspaceId }),
  });
  return response.json();
};
