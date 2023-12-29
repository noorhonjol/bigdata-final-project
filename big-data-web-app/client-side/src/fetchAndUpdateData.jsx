export const fetchAndUpdateData = (socket, setDataCallback) => {
    socket.on('dbUpdate', data => {
        try {
            let newData = JSON.parse(data);
            newData.forEach(item => {
                item.count = parseInt(item.count);
                item.user = item.user.split(' ')[0];
            });
            setDataCallback(newData);
            localStorage.setItem('cachedData', JSON.stringify(newData));
        } catch (error) {
            console.error('Error parsing data:', error);
        }
    });
};
