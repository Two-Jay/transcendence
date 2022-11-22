import { useRouter } from 'next/router'
import { MouseEventHandler, FC, SVGProps } from 'react';
import { useRecoilValue } from 'recoil';
import { pushingState } from '../recoil/menuState';
import Sidebar from './Sidebar';

export interface SidebarLinkProps {
  to: string;
  text: string;
  able: boolean;
  icon: FC<SVGProps<SVGSVGElement>>;
}

export default function SidebarLink(props: SidebarLinkProps) {
  const router = useRouter();
  //const [pushing, setPushing] = useRecoilState(pushingState);
  const pushing = useRecoilValue(pushingState);

/*
  router.events.on('routeChangeStart', () => {
    setPushing(true);
  })
  router.events.on('routeChangeComplete', () => {
    setPushing(false);
  })
*/

  const clickHandler: MouseEventHandler = (e)=> {
    e.preventDefault();
    if (props.able) {
      //if (router.pathname === props.to)
      //  console.log("already in ", props.to);
      //else
      if (!pushing) {
        console.log('push to', props.to);
        router.push(props.to);
      } else
        console.log('already pushing to', props.to)
    }
    else
      console.log("can't go to ", props.to);
  }

  return <span onClick={clickHandler}>
      <Sidebar.Item
        href={props.to}
        icon={props.icon}
        //disabled={true}//{!props.able}
        //active={false}//{router.pathname === props.to}
      >
        {props.text}
      </Sidebar.Item>
  </span>;
}
