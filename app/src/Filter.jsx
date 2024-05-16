const Filter = ({filter, handler}) => {
    return (
        <>
            filter shown with <input value={filter} onChange={handler}/>
        </>
    )
}

export default Filter