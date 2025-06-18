const API_BASE_URL = "http://localhost:5000/api";
export default API_BASE_URL;

// reusable user delete function
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