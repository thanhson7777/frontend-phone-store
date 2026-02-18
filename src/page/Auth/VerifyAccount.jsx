import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerifycation() {
  let [searchParams] = useSearchParams()
  // console.log('🚀 ~ AccountVerifycation ~ searchParams:', searchParams)
  // const email = searchParams.get('email')
  // const token = searchParams.get('token')

  const { email, token } = Object.fromEntries([...searchParams])
  // console.log(Object.fromEntries([...searchParams]))
  // Tạo State để biết được tài khoản đã được verify hay chưa
  const [verified, setVerified] = useState(false)

  // Gọi API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])

  if (!verified) {
    return <PageLoadingSpinner caption="Đang xác minh..." />
  }
  // Nếu verify thành công thì cho vế trang login
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerifycation