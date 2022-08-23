export const postData = async (submittedData, urlEnd) => {
    try {
        const response = await fetch(`/api/${urlEnd}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submittedData)
        });
        return await response.json();
    } catch (error) {
        console.log(error);
    }
};