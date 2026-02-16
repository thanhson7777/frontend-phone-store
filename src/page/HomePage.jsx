import { Box, Container, Grid } from '@mui/material'
import Banner from '~/components/Banner/Banner'
import CategoryList from '~/components/Category/Category'
import ProductList from '~/components/Product/ProductList'

function HomePage() {
  return (
    <Box>
      <Banner />
      <Container>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={3}>
            <CategoryList />
          </Grid>
          <Grid item xs={12} md={9}>
            <Box>
              <ProductList />
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}

export default HomePage