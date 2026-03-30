module.exports.issueErrorAlert = (response,status=404,errorMessage,faultyInputName) => {
    response.status(status).json({error : errorMessage, faulty_input : faultyInputName})
}
