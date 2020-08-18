
/*
App should have the following functionality: list, add, toggle, delete and display to-dos,  

Can take advantage of the Apollo react-hooks to display the array of todo items on the page. Will need the help of gql to write query. 
Pattern for all function components will be to import a hook to perform a GraphiQL operation and import gql to parse the query from 
GraphiQL. 

Started program by executing the getTodos query from GraphiQL and handled error and loading states. 
useQuery returns 2 objects. In the 1st object, data is undefined and loading is set to true. In the 2nd object, data is populated with 
the todo items from GraphiQL and loading is set to false. Since an object is returned, can destructure the properties that are important, 
data and loading.  

Once errors and loading states addressed, next step is to build out static structure of application. Need a form to add the todos. Want 
to create a nicer looking UI and all elements. Begin by adding the html elements (h1, form, button). Also adding a CSS library for styling. 
Tachyons provides a lot of utility classes, which means the ability to add classes directly on the element w/o having to create the 
styles myself.  Copy paste the cdn from https://tachyons.io/ in the <Head> section on the index.html file. Can now modify styles by 
adding the utility classes. For the parent div I am returning, vh-100 covers the entire height of the page and 'code' is the font class. 
Center everything with flex box and use the classes flex-columns, items-center. Set the background to purple and set the text to white and 
give div padding where 3 is a variant of 1-5. For the form, mb3 = margin bottom3 to separate from the list. Input has a padding of 2, font
size 4 and dashed border. The button has padding of 2, font of 4 and green background. On the todo list, pointer changes the mouse/curser
to a hand when user hovers over todo item. The button on the todo item is transparent and has button styles with bn. 

Next adding toggle functionality. Go to GraphiQL to create/test mutation before bringing mutation query/function into React. Upon 
confirming the mutation toggleTodo works in GraphiQL, I need to create a variable that holds on to the mutation in order to execute it. 
Using gql, paste the successful mutation from GraphiQL. Pass useMutation the variable TOGGLE_TODO. useMutation returns a function as 
the 1st element in an array. As a result, using array destructuring and will call the function toggleTodo. I want to execute the mutation 
when a todo is double-clicked. On the <p> element, add a doubleClick event and pass in the handleToggleTodo function. Within function, 
execute toggleTodo. In order to execute toggleTodo, need to pass in the values the function needs, which is the todo id and the done 
property. Instead of passing handleToggleTodo as a reference. -> <p onDoubleClick={handleToggleTodo}>, can use an arrow function
that calls handleToggleTodo in the return and pass in the entire todo object. -> <p onDoubleClick={() => handleToggleTodo(todo)}>. When
the todo is double-clicked, the event of the single todo is passed to the handleToggleTodo function. To pass the 2 values from the mutation, 
(id and done), can add an object when calling the toggleTodo mutating function and those values will be provided on a variables object. 
Recheck the mutation to confirm what properties it will accept. Here, the mutation accepts an id property with an appropriate value and a
done property with an appropriate value. So need to set id to todo.id and done to !todo.done (the opposite of what its boolean value is).
The mutation function toggleTodo returns a promise. To resolve it and get back the updated todo data from the returning subfield in const
TOGGLE_TODO, can chain on a then callback and get the data like -> .then(data => console.log(data)). OR can write handleToggleTodo as an 
async function, wait for the promise to be resolved (via await), and put the response/return data in a variable. 

Also want to 'strike-thru' the todo when its complete. On the span that holds the text, add a simple conditional using template literals. 
Can say...if todo.done is true, then add the class and add the class strike. The strike will be removed when the todo is double-clicked
because the toggle mutation will reverse the status. 

Next step is to make form useful by adding todos. Return to GraphiQL and create dynamic addTodo mutation. Once confirmed the mutation is 
working, can execute the useMutation hook again. Create a variable called ADD_TODO and pass in the mutation from GraphiQL to qgl. Then pass
ADD_TODO to useMutation, which returns a mutate function in an array. Will destrucutre and call the function addTodo. I want to add a todo
when the form is submitted. Begin by adding an onSubmit event to the form and pass in a handleAddTodo function.  With handleAddTodo function,
receive the event and add event.PreventDefault to prevent page from auto refreshing. For the mutation, will need to provide data on the 
variables object. Need to get some text and store what is written in the input. Can store the data written in the input with an onChange
event. Before creating the event, will need to create dedicated state for the text to live in. Call React.useState(), set to an empty 
variable. useState returns an array [stateVariable, functionForStateVariable]. Will call the state variable todoText. Want to store the 
todoText when I call setTodoText. On the onChange event, when we get an event from onChange, can write an inline function to call setTodoText
and pass in event.target.value. Also want to make this a controlled component, so set the input value to todoText so that is controlled
by state and can be easily cleared out. Now that I am updating todoText, I have something to pass to the addTodo function from useMutation. 
First want to put in measures so that user cannot type in empty spaces or nothing before submitting the form. Write a conditional for this. 
If !todoText than return, meaning if there is not todoText then do nothing. And can apply the trim method to ensure the text is not empty.
The trim method clears/removes whitespace from both ends of a string. Only allow submit when input is not blank. For the addTodo function,
need to provide the text value which will come from todoText. Add async to ensure mutation executed successfully, await addTodo and get
back data. Finally want to clear the form by setting setTodoText to an empty string. Check console to make sure working as expected. 

The todo's typed into input do not automatically update the UI. But the toggle method does immediately show the strike-thru in the UI. This
is related to what Apollo does to its internal cache when a new client is set up. Can think of cache as an internal record of data. In some
cases when certain mutations are executed, its easy for Apollo to use the cache to update the UI. Like with the toggle mutation, Apollo was
able to use the cache to figure out how to update the UI with the strike-thru. For other mutations, such as creating or deleting a resource,
Apollo is not able to update the cache so that a new item will appear in the UI. Apollo needs some additional instructions to do so. In 
these scenarios, Apollo needs instructions on how to update the cache in order for the changes to be presented to user, displayed in UI. 
An easy approach to updating what the user sees is what's called 're-fetching' the original query. Within the handleAddTodo function, 
can add another property after variables, called refetchQueries. refetchQueries accepts an array of queries that are each listed in their
own object. What I am basically saying is...after you perform the addTodo function, I want you to re-execute the query provided in 
refetchQueries. Here I want to the query refetch GET_TODOS (from GraphiQL). If the query required variables, I can pass on the variables
object -> refetchQueries: [ {query: GET_TODOS, variables: {} } ]. In this case GET_TODOS does not require variables. In summary, this 
process is executing a query after a mutation has completed. Once the addTodo function/mutation is complete, refetchQueries will initiate 
and request the GET_TODOS query to run (from GraphiQL). This additional detail will be provided to Apollo which will then have adequate 
info to know how to display data in the UI from the cache. This is an easy approach and in doing so is making another http request. 
This approach can take more time and computing resources that is really required as a result. 

Can also run code when a given mutation is completed by adding a 2nd argument to useMutation (add an object). When the 2nd parameter (object)
is added, will be granted access to an onCompleted callback. Instead of clearing input by calling setTodoText() at the end of the 
handleAddTodo function, can write an inline function to clear the form as the 2nd parameter. 
  -> const [addTodo] = useMutation(ADD_TODO, {onCompleted: ()=> setTodoText('"") })

Now want to work on delete functionality. Want to delete todo when the red x next to the todo is clicked. Return to GraphiQL and create
mutation for deleting todo. Once confirmed mutation is working properly, call useMutation again. Create a variable called DELETE_TODO, 
pass in the mutation from GraphiGL to gql. Pass DELETE_TODO to useMutation. Get back the mutate function and call it deleteTodo. This
is aligns/matches the function name from GraphiQL. Add an onClick event to the button and attach an inline function. The arrow function 
will call the handleDeleteTodo function and pass in the entire object to handleDeleteTodo.  From the handleDeleteTodo function, destructure
the id property. Then call in the function deleteTodo. Pass in an object to get the variables object (from DELETE_TODO). The variables 
object will just receive the id as the property name and value. Want to ask user to confirm if they want to delete Todo. Use 
window.confirm('Do you want to delete this todo?'). If value is true, then delete the todo. Check console to ensure working as expected. 
To have todo removed from UI, I want to update the internal cache and basically say...I deleted a todo. I want to tell the cache Apollo is
managing that I successfully removed a todo and I want to write those changes directly to the GET_TODOS query in order to update the UI. 
Just like refetchQueries which is a property available within the mutate function, can add a comma to get access to the update function. 
The update function gives me direct access to the cache. Write an inline arrow function within the parameters to get the cache itself. 
Then say....give me whats in the cache for GET_TODOS, what is the previous cache data.  Create a variable for previous cache data. Then 
can read from the cache by obtaining what Apollo is storing by calling cache.readQuery. Within readQuery, can specify the query that I want
to get the local data for. -> update: cache => {const prevData = cache.readQuery({query:GET_TODOS })This is all the data before the mutation is formed. 
Once I have whats stored in the cache, I want to manually update it by saying....I deleted a tood, the data has changed. I want to take 
the previous data, specifically the todos array off of it. The array has the same structure from data in const {data, loading, error } = useQuery(GET_TODOS).   
Where data is an object that consists of a todos array. I want to filter the array and make sure it does not match the id that was clicked
for deletion. This will remove the todo that was deleted. Store the results of the new array in a variable called newTodos. At this point
I have read from the cache, manually updated it, now want to write back to the cache/give Apollo the new value to update what the user sees. 
The opposite of readQuery is writeQuery. within writeQuery, select the query get GET_TODOS and use the data property to pass in the data itself. 
With the data property, specifically want to update the todos array with newTodos. -> cache.writeQuery({query:GET_TODOS, data: {todos: newTodos}

All caps for gql queries indicates variable value will never be updated in any way. 
*/


import React from 'react' 
import { useQuery, useMutation} from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const GET_TODOS = gql`  
query getTodos {
  todos {
    done
    id
    text
  }
}
`
const TOGGLE_TO = gql`
mutation toggleTodo($id: uuid!, $done: Boolean!) {
  update_todos(where: {id: {_eq: $id}}, _set: {done: $done}) {
    returning {
      done
      id
      text
    }
  }
}
`
const ADD_TODO = gql`
mutation addTodo($text: String!) {
  insert_todos(objects: {text: $text}) {
    returning {
      done
      id
      text
    }
  }
}
`
const DELETE_TODO = gql`
mutation deleteTodo($id: uuid!) {
  delete_todos(where: {id: {_eq: $id}}) {
    returning {
      done
      id
      text
    }
  }
}
`
function App() {
  //const stuff = useQuery(GET_TODOS) //console log stuff to see what data/properties are returned from useQuery. 
  const [todoText, setTodoText] = React.useState('')
  const {data, loading, error } = useQuery(GET_TODOS)  //destructuring properties from object 
  const [toggleTodo] = useMutation(TOGGLE_TO) //useMutation returns a function, which I am calling toggleTodo. 
  const [addTodo] = useMutation(ADD_TODO, {onCompleted: ()=> setTodoText("")}) //adding 2nd parameter to clear the form 
  const [deleteTodo] = useMutation(DELETE_TODO)

  async function handleToggleTodo( {id, done }) {  //destructuring id & done from event. doubleClicking will pass the event for the todo that is clicked. 
    const data = await toggleTodo({ variables: {id, done: !done} })
    console.log('toggled todo', data)

  }

  async function handleAddTodo(event){ //destructure text from the event { text, event }
    event.preventDefault()
    if (!todoText.trim()) return 
    const data = await addTodo( {variables:{text: todoText}, refetchQueries:[{query: GET_TODOS}]} )
    console.log('added todo', data)
    //setTodoText('') addTodo mutation now responsible for clearing input 
  }

  async function handleDeleteTodo({ id }){
    const isConfirmed = window.confirm('Do you want to delete this todo?')
    if (isConfirmed) {
      const data = await deleteTodo({ variables: { id }, 
        update: cache => {
          const prevData = cache.readQuery({query: GET_TODOS })
          const newTodos = prevData.todos.filter(todo => todo.id !==id)
          cache.writeQuery({query: GET_TODOS, data: {todos: newTodos}})
      }
    })
      console.log('deleted todo', data)
    }  
  }

  if (loading) return <div>Loading Todos...</div>
  if(error) return <div>Error fetching Todos...</div> //will prevent app from crashing and will give insight into error

  return (
    <div className='vh-100 code flex flex-column items-center bg-purple white pa3 fl-1'>
      <h1 className='f2-l'>
        GraphQL Checklist
        <span role='img' aria-label='Checkmark'>✔️</span>
        
        </h1>
      {/*Todo form */}
      <form onSubmit={handleAddTodo} className='mb3'>
        <input className='pa2 f4 b--dashed' type='text' 
        placeholder='Write your todo' 
        onChange={event => setTodoText(event.target.value)}
        value={todoText}
        />
        <button className='pa2 f4 bg-green' type='submit'>Submit</button>  
      </form>
      {/*Todo List -putting list in a parent div */}
      <div className='flex items-center justify-center flex-column'>
        {data.todos.map(todo => (
        <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
          <span className={`pointer list pa1 f3 ${todo.done && 'strike'}`}>{todo.text}</span>
          <button onClick={()=> handleDeleteTodo(todo)} className='bg-transparent bn f4'>
            <span className='red'> &times; </span> {/* &times; = places a unicode x to the right of the span. will be used to delete todo  */}
          </button> 
        </p>     
      ))}
      </div>
    </div>
  )  
}

export default App 
