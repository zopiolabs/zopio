import { RichText } from 'basehub/react-rich-text';
import type { ComponentProps, ReactElement, ReactNode } from 'react';

type RichTextComponentProps = {
  children: ReactNode;
  href?: string;
};

type TableOfContentsProperties = Omit<
  ComponentProps<typeof RichText>,
  'children'
> & {
  readonly data: ComponentProps<typeof RichText>['children'];
};

export const TableOfContents = ({
  data,
  ...props
}: TableOfContentsProperties) => (
  <div>
    <RichText
      // @ts-ignore - The types from basehub/react-rich-text are not fully compatible with our usage
      components={{
        ol: (props: RichTextComponentProps): ReactElement => (
          <ol className="flex list-none flex-col gap-2 text-sm">{props.children}</ol>
        ),
        ul: (props: RichTextComponentProps): ReactElement => (
          <ul className="flex list-none flex-col gap-2 text-sm">{props.children}</ul>
        ),
        li: (props: RichTextComponentProps): ReactElement => <li className="pl-3">{props.children}</li>,
        a: (props: RichTextComponentProps): ReactElement => (
          <a
            className="line-clamp-3 flex rounded-sm text-foreground text-sm underline decoration-foreground/0 transition-colors hover:decoration-foreground/50"
            href={`#${props.href?.split('#').at(1)}`}
          >
            {props.children}
          </a>
        ),
      }}
      {...props}
    >
      {data}
    </RichText>
  </div>
);
