import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import MailIcon from '@mui/icons-material/Mail'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'

import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'


function AccountTab() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const initialGeneralForm = {
    displayName: currentUser?.displayName
  }
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialGeneralForm
  })

  const submitChangeGeneralInformation = (data) => {
    const { displayName } = data

    if (displayName === currentUser?.displayName) return

    // Gọi API
    toast.promise(
      dispatch(updateUserAPI({ displayName })),
      { pending: 'Đang cập nhật...' }
    ).then(res => {
      if (!res.error) {
        toast.success('Cập nhật thành công!')
      }
    })
  }

  const uploadAvatar = (e) => {
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }

    // Sử dụng FormData để xử lý dữ liệu liên quan tới file khi gọi API
    let reqData = new FormData()
    reqData.append('avatar', e.target?.files[0])
    toast.promise(
      dispatch(updateUserAPI(reqData)),
      { pending: 'Đang cập nhật ảnh đại diện...' }
    ).then(res => {
      if (!res.error) {
        toast.success('Cập nhật ảnh đại diện thành công!')
      }

      e.target.value = ''
    })
  }

  const handleFileChange = (e) => {
    const file = e.target?.files?.[0]
    if (!file) return
    const error = singleFileValidator(file)
    if (error) {
      toast.error(error)
      e.target.value = ''
      return
    }

    const url = URL.createObjectURL(file)
    setPreview(url)
    uploadAvatar(e)
  }

  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
      <Box sx={{ width: 240, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          src={preview || currentUser?.avatar}
          sx={{ width: 120, height: 120, mb: 1 }}
        >
          {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase()}
        </Avatar>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <Tooltip title="Tải ảnh lên">
          <Button startIcon={<CloudUploadIcon />} onClick={() => fileInputRef.current?.click()}>
            Tải ảnh
          </Button>
        </Tooltip>
      </Box>

      <Box component="form" onSubmit={handleSubmit(submitChangeGeneralInformation)} sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Email"
          value={currentUser?.email || ''}
          disabled
          InputProps={{ startAdornment: (<InputAdornment position="start"><MailIcon /></InputAdornment>) }}
        />

        <TextField
          label="Tên đăng nhập"
          value={currentUser?.username || currentUser?.userName || ''}
          disabled
          InputProps={{ startAdornment: (<InputAdornment position="start"><AccountBoxIcon /></InputAdornment>) }}
        />

        <TextField
          label="Tên hiển thị"
          {...register('displayName', { required: FIELD_REQUIRED_MESSAGE })}
          error={!!errors.displayName}
          helperText={errors.displayName?.message}
          InputProps={{ startAdornment: (<InputAdornment position="start"><AssignmentIndIcon /></InputAdornment>) }}
        />

        {errors.displayName && <FieldErrorAlert error={errors.displayName} />}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Lưu thay đổi</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default AccountTab
