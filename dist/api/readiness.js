export const handleReadiness = async (req, res) => {
    res.set('Content-type', 'text/plain');
    res.send("OK");
};
