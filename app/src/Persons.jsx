import Person from "./Person"

const Persons = ({persons, onClick}) => {
    return (
        <>
            {persons.map(person => <Person person={person} key={person.id} onClick={onClick}/>
      )}
        </>
    )
}

export default Persons