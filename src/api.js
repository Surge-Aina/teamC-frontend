// base url for backend api requests
const API_BASE_URL = "https://teamc-backend.onrender.com/api";
// for local development
//const API_BASE_URL = "http://localhost:5000/api"; 

export default API_BASE_URL;

// function: deleteUser
// parameters:
//   userId (string)
//   token (string)
// returns: promise<boolean>
// description:
// deletes a user by id using the provided auth token. returns true if successful, error if not
export async function deleteUser(userId, token) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete user");
    }
    return true;
}