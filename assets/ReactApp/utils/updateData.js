export const updateData = async (identifier, updates, urlEnd) => {
    try {
        const response = await fetch(`/api/${urlEnd}/${identifier}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        return await response.json()
    } catch (error) {
        console.log(error);
    }
};