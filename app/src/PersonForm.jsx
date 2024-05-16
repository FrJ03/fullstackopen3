import PersonFormElement from './PersonFormElement'

const PersonForm = ({form}) => {
    return (
    <form onSubmit={(event) => form.submit.handler(event)}>
        {form.elements.map((element, i) => <PersonFormElement element={element} key={i}/>)}
        <div>
          <button type="submit">{form.submit.text}</button>
        </div>
      </form>)
}

export default PersonForm