import { Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

const LinkItem = ({ href, _target, children, ...props }: any) => {
  const { pathname } = useRouter();
  let isActive = false;

  if (href !== "/") {
    const [, path] = href.split("/");
    isActive = pathname.includes(path);
  } else if (href === pathname) {
    isActive = true;
  }

  return (
    <NextLink href={href} passHref>
      <Link
        p={2}
        color={isActive ? "aqua.300" : "stone"}
        _target={_target}
        {...props}
      >
        {children}
      </Link>
    </NextLink>
  );
};

export default LinkItem;
