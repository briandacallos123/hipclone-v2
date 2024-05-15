"use client"
/// sections
import { NotFoundView } from 'src/sections/error';
// layouts
import { View500 } from 'src/sections/error';
// ----------------------------------------------------------------------

export const metadata = {
  title: '404 Page Not Found!',
};




export default function NotFoundPage() {
 
const isInvalidVoucher = localStorage.getItem('invalidVoucher');

  return isInvalidVoucher ? <View500/>:<NotFoundView />;
}
