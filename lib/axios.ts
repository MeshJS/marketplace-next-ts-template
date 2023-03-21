import axios from "axios";

const instance = axios.create({
  baseURL: `/api/`,
  withCredentials: true,
});

export async function get(route, params = {}) {
  return await instance
    .get(`${route}`, { params })
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

export function post(route: string, body = {}) {
  return instance
    .post(`${route}`, body)
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

export async function getLatestListings() {
  return await get("getListings");
}

export async function searchListings(policy) {
  return await get("searchListings", { policy });
}

export async function getListingsUser(address) {
  return await get("getListingsUser", { address });
}

export async function addListing(newListing) {
  return await post("addListing", { newListing });
}

export async function updateListing(updatedListing) {
  return await post("updateListing", { updatedListing });
}

export async function deleteListing(unit) {
  return await post("deleteListing", { unit });
}
