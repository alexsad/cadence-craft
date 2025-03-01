import { HTMLAttributes } from "react"
import { ReactProps } from "../interfaces/react-props"

const Flex: React.FC<{
    vertical?: boolean,
    justify?: string,
    align?: string,
    gap?: string,
    wrap?: 'nowrap' | 'wrap',
    padding?: string,
    style?: React.CSSProperties,
    className?: string,
} & ReactProps & HTMLAttributes<HTMLDivElement>
> = ({
    children,
    className,
    style,
    gap,
    justify,
    align,
    vertical,
    wrap,
    padding,
    ...htmlAttrs
}) => {
        const mergedStyle: React.CSSProperties = {
            ...style,
            display: 'flex',
            gap: gap,
            justifyContent: justify?.includes('end') ? 'flex-end' : justify,
            alignItems: align,
            flexDirection: vertical ? 'column' : 'row',
            flexWrap: wrap ? wrap : 'nowrap',
            padding: padding,
        }
        return (
            <div
                className={className}
                style={mergedStyle}
                {...htmlAttrs}
            >{children}</div>
        )
    }

export { Flex }

