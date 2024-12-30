"use client";
export default function CustomButton({ title, onClick }) {
  return <button onClick={onClick}>{title}</button>;
}
