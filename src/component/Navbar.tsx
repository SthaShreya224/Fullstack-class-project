function Navbar() {
  return (
    <div className='border-b border-gray-600 flex flex-row items-center justify-between p-4 bg-gray-800 text-white w-full'>
      <div className='font-bold'>Logo</div>

      <nav className='flex flex-row items-center gap-6'>
        <div>Home</div>
        <div>Products</div>
        <div>About</div>
        <div>Contact</div>
      </nav>
    </div>
  )
}

export default Navbar;