import { Badge, IconButton, Tooltip } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Link } from 'react-router-dom'

function CartIcon() {
  // Sử dụng redux ở đây
  const mockCartQuantity = 2

  return (
    <Tooltip title="Giỏ hàng">
      <IconButton component={Link} to="/cart" sx={{ color: 'white' }}>
        <Badge badgeContent={mockCartQuantity} color="warning">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  )
}

export default CartIcon