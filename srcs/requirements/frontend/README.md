This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


It also includes:

- [x] [`flowbite`](https://flowbite.com)
- [x] [`flowbite-react`](https://flowbite-react.com)
- [x] [`react-icons`](https://react-icons.github.io/react-icons)
- [x] [`tailwindcss`](https://tailwindcss.com)
- [x] Quality of life tools, like
  - [x] [`eslint`](https://eslint.org) with some plugins
  - [x] [`prettier`](https://prettier.io)

## Getting started

`Next.js` requires [`Node.js`](https://nodejs.org).

If you don't already have `npm` available, make sure you set them up.

```bash
npm i -g npm
```

Install the dependencies:

```bash
npm install
```

Now you can run the development server:

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

## Outstanding issues

- **Carousel**s don't seem to work with [`next/image`](https://nextjs.org/docs/api-reference/next/image), so a normal `<img/>` is required, which ESLint will warn about
- **Modal**s don't work on `next` on `react@18` because of an hydration mismatch

## Learn more

### About `next`

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### About `flowbite`

[Flowbite](https://flowbite.com) is an open source collection of UI components built with the utility classes from Tailwind CSS that you can use as a starting point when coding user interfaces and websites.

In this repository, we setup [`flowbite-react`](https://flowbite-react.com) for you with examples of how to use the React components in `pages/index.tsx`.

## Deploy on `vercel`

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.





??? ???????????? ?????????
src
  component
      GameListener.tsx: ???????????? ?????? ???????????? ??????
      GameInfo.tsx: GameList??? GUserList??? ????????? component
      GameList.tsx: Game ?????? component
      GUserList.tsx: ?????? ?????? player, observer ???????????? ?????? ?????? (?????????)
      PongButtons.tsx: ???????????? ?????? component (?????????)
      PongGame.tsx: p5 ????????? ?????????
      PongHelper.tsx: ????????? ??????
  pages
      pong.tsx: /pong
  recoil
      gameFn.ts: isPlayer, isObserver, isJoined ?????? ??????
      gameState.ts: gameMapAtom<number, GameRoomDto> ??????, currentGameRoomIdAtom ??????
      gameType.ts: GamePlayDto, GameRoomDto ????????? ??????
      mapUtils.ts: setGames (gameMap recoil set) ?????? GameMapUtils ??????
