
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div>
        <div>
            <h1>Create an Account</h1>
            <p>Already have an account? <Link to='/signin'>Login</Link></p>
        </div>
    </div>
  )
}

export default Signup