import { useRouter } from 'next/router'
import {Navbar} from "flowbite-react";
import { MouseEventHandler  } from 'react';
import { useRecoilValue } from 'recoil';
import { pushingState } from '../recoil/menuState';

export interface NavLinkProps {
  to: string;
  text: string;
  able: boolean;
}

export default function NavLink(props: NavLinkProps) {
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
        //console.log('push to', props.to);
        router.push(props.to);
      } else
        console.log('already pushing to', props.to)
    }
    else
      console.log("can't go to ", props.to);
  }

  return <span onClick={clickHandler}>
      <Navbar.Link
        disabled={!props.able}
        href={props.to}
        active={router.pathname === props.to}
      >
          {props.text}
      </Navbar.Link>
  </span>;
}
