import { LogoutIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Layout } from '../components/Layout'

const Dashboard: NextPage = () => {
  const router = useRouter()
  const logout = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`)
    router.push('/')
  }
  return (
    <Layout title="Task borad">
      {' '}
      <LogoutIcon
        className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
        onClick={logout}
      />
    </Layout>
  )
}

export default Dashboard
