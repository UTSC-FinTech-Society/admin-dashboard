const convertArrayBufferToBase64String = (buffer?: ArrayBuffer) => {
    if (buffer) {
        const typed_array = new Uint8Array(buffer);
        const string_char = typed_array.reduce((data, byte)=> {
            return data + String.fromCharCode(byte);
        }, '');
        const base64String = btoa(string_char);
        return base64String;
    }
};

export default convertArrayBufferToBase64String;