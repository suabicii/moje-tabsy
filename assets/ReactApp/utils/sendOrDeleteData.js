export const sendOrDeleteData = async (identifier = null, data = null, requestMethod, route) => {
    try {
        const options = {
            method: requestMethod,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(`/api/${route}/${identifier || ''}`, options);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
};