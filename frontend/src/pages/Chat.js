const sendMessage = async () => {
    await axios.post("http://127.0.0.1:8000/api/chat/", {
        receiver: selectedUser.id,
        message: newMessage
    });
    setNewMessage("");
};
