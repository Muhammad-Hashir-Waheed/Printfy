interface HeadingProps {
   title: string
   description: string
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
   return (
      <div className="my-4">
         <h2 className="typo-h2">{title}</h2>
         <p className="typo-body text-muted-foreground">{description}</p>
      </div>
   )
}
