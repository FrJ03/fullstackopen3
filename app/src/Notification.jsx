const Notification = ({type, message}) => {
    if(message === null){
        return null
    }
    else{
        return (
            <div className={type === "success" ? "successMessage" : "errorMessage"}>
                {message}
            </div>
        )
    }
}

export default Notification