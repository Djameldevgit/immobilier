import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

export const getDataAPI = async (url, token) => {
  const res = await axios.get(`${baseURL}/api/${url}`, {
    headers: { Authorization: token }
  });
  return res;
};

export const postDataAPI = async (url, post, token) => {
  const res = await axios.post(`${baseURL}/api/${url}`, post, {
    headers: { Authorization: token }
  });
  return res;
};

export const putDataAPI = async (url, post, token) => {
  const res = await axios.put(`${baseURL}/api/${url}`, post, {
    headers: { Authorization: token }
  });
  return res;
};

export const patchDataAPI = async (url, post, token) => {
  const res = await axios.patch(`${baseURL}/api/${url}`, post, {
    headers: { Authorization: token }
  });
  return res;
};

export const deleteDataAPI = async (url, token) => {
  const res = await axios.delete(`${baseURL}/api/${url}`, {
    headers: { Authorization: token }
  });
  return res;
};