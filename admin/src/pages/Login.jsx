import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)
  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const endpoint = `${backendUrl}/api/${state.toLowerCase()}/login`
      const { data } = await axios.post(endpoint, { email, password })

      if (data.success) {
        toast.success(`${state} login successful`)

        if (state === 'Admin') {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
          navigate('/admin/dashboard') // change to actual route
        } else {
          setDToken(data.token)
          localStorage.setItem('dToken', data.token)
          navigate('/doctor/dashboard') // change to actual route
        }
      } else {
        toast.error(data.message || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Something went wrong during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-primary'>{state}</span> Login
        </p>
        <div className='w-full'>
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='email'
            required
          />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='password'
            required
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          className='bg-primary text-white w-full py-2 rounded-md text-base'
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p>
          {state === 'Admin' ? (
            <>
              Doctor Login?{' '}
              <span
                onClick={() => setState('Doctor')}
                className='text-primary underline cursor-pointer'
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Admin Login?{' '}
              <span
                onClick={() => setState('Admin')}
                className='text-primary underline cursor-pointer'
              >
                Click here
              </span>
            </>
          )}
        </p>
      </div>
    </form>
  )
}

export default Login
