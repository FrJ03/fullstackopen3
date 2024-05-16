const PersonFormElement = ({element}) => {
    return (
        <div>
            {element.label}: <input value={element.value} onChange={(event) => element.handler(event)}/>
        </div>
    )
}

export default PersonFormElement