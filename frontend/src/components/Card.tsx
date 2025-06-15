interface CardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`overflow-hidden rounded-lg bg-white shadow ${className}`}>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">{children}</div>
    </div>
  )
} 