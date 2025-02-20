import { ReactProps } from "../interfaces/react-props"

const Flex: React.FC<{
    vertical?: boolean,
    justify?: string,
    align?: string,
    gap?: string,
    wrap?: 'nowrap' | 'wrap',
    style?: React.CSSProperties,
    className?: string,
} & ReactProps> = ({ children, className, style, gap, justify, align, vertical, wrap }) => {
    const mergedStyle: React.CSSProperties = {
        ...style,
        display: 'flex',
        gap: gap,
        justifyContent: justify?.includes('end') ? 'flex-end' : justify,
        alignItems: align,
        flexDirection: !!vertical ? 'column' : 'row',
        flexWrap: !!wrap ? wrap : 'nowrap',
    }
    return (
        <div
            className={className}
            style={mergedStyle}
        >{children}</div>
    )
}

export { Flex }

