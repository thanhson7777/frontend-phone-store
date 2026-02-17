import { Badge, IconButton, Tooltip } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { selectCurrentCarts } from '~/redux/carts/cartSlice'

function CartIcon() {
  // Sử dụng redux ở đây
  // const mockCartQuantity = 2

  const currentUser = useSelector(selectCurrentUser)

  const cart = useSelector(selectCurrentCarts)

  const cartItemsCount = cart?.products?.length || 0

  return (
    <Tooltip title="Giỏ hàng">
      <IconButton component={Link} to="/cart" sx={{ ml: 2, color: 'white' }}>
        <Badge
          badgeContent={currentUser ? cartItemsCount : 0}
          color="warning"
          invisible={!currentUser || cartItemsCount === 0}
        >
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  )
}

export default CartIcon