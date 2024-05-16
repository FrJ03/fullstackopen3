const Person = ({person, onClick}) => {
    return (
        <div>
            {person.name} {person.number} <button type="submit" onClick={event => onClick(event, person)}>Delete</button>
        </div>
    )
}

export default Person