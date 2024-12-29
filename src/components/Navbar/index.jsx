import { Box, Button, Typography } from "@mui/material"


const Navbar = () => {
    
    return (
        <Box sx={{
            backgroundColor: '#ffdd93', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', position: 'sticky', top: 0,
            flex: 1,
            width: '100%',
            height: '3.5rem',
            zIndex: 5,
        }}>
           <Typography sx={{fontSize: '2rem', fontFamily: 'sans-serif', fontWeight: 800, color:'#424242', marginLeft: '1rem'}}>Supabase Store - Inventory</Typography>
        </Box>
    )
}

export default Navbar