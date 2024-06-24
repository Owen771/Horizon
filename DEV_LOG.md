
Login to the app:

- contact@mail.pro
- password


## Next.js

- By default, all components in Next js is a server components, unless specify otherwise

Feature

- SSR (server side rendering)
- Route groups
- nested layout
- server action
- more advance & reusable form management by ts, react hook form, zod

## Shadcn/ui Benefit

As an ui library, it allows dev can only add the component that they wanna use, instead of adding the whole ui library into the project (like material UI or bootstrap..)

```
├── components
│   ├── ui
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...
```

## Non src code Files

1. [tailwind conf file](tailwind.config.ts)

It defined some styles globally, and it can be accessed like `text-success-900` rather than some magic values like `text-[#054F31]`

```
 success:
 {
    25: "#F6FEF9",
    50: "#ECFDF3",
    100: "#D1FADF",
    600: "#039855",
    700: "#027A48",
    900: "#054F31",
  },
```

2. [types](types/index.d.ts): custom type
3. [utils](lib/utils.ts): some general utils, like format date time

## Layout -> Route Groups from Next.js

- https://nextjs.org/docs/app/building-your-application/routing/route-groups

- Home page nad My Banks are same layout -> reusable layout
- Sign in got its own layout

- In the app directory, nested folders are normally mapped to URL paths.
- mark a folder as a Route Group to prevent the folder from being included in the route's URL path.
  - usage: `(folderName)`

Route groups are useful for:

- Organizing routes into groups e.g. by site section, intent, or team.
- Enabling nested layouts in the same route segment level (all route in same group can share the layout)

## Root (route to 4 pages)

Global sidebar / mobile nav bar

1. Home Page
    - header + TotalBalance
    - right side bar, showing user info and its cards

2. my banks
3. trnx history
4. transfer funds

## Auth

- AuthForm for both sign-in and sign-up
  - used shadcn ui form
  - The page of sign-in and sign-up usually are server side [sign in page](<app/(auth)/sign-in/page.tsx>), but the form inside is client side [authform](components/AuthForm.tsx)
  - form always have to be used `'use client'`, becoz of the keyboard and mouse event, such as onSubmit, key press etc
  - the data submitted from form -> send to appwrite async

[getLoggedInUser](lib/actions/user.actions.ts) example data from appwrite

```json
{
  "$id": "667778af001d00ae14a4",
  "$createdAt": "2024-06-23T01:21:53.627+00:00",
  "$updatedAt": "2024-06-23T01:21:53.627+00:00",
  "name": "Owen JSM",
  "registration": "2024-06-23T01:21:53.620+00:00",
  "status": true,
  "labels": [],
  "passwordUpdate": "2024-06-23T01:21:53.620+00:00",
  "email": "contact@mail.pro",
  "phone": "",
  "emailVerification": false,
  "phoneVerification": false,
  "mfa": false,
  "prefs": {},
  "targets": [
    {
      "$id": "667778b1a85c80c71fb2",
      "$createdAt": "2024-06-23T01:21:53.689+00:00",
      "$updatedAt": "2024-06-23T01:21:53.689+00:00",
      "name": "",
      "userId": "667778af001d00ae14a4",
      "providerId": null,
      "providerType": "email",
      "identifier": "contact@mail.pro"
    }
  ],
  "accessedAt": "2024-06-23T01:21:53.620+00:00"
}
```


## Next.js backend interact

- https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Server Actions are asynchronous functions that are executed on the server. They can be used in Server and Client Components to handle form submissions and data mutations in Next.js applications.
- `'use server'`


### [Act as Backend / making API call to 3rd party](lib/actions)

- user sign-in and sign-up

3rd party, configuring the client
- appwrite
- plaid

## `useCallback()`


- it can prevent unnecessary re-renders of the child component by ensuring that the callback function remains the same reference between renders, as long as its dependencies have not changed. This can help optimize performance and improve the user experience by reducing unnecessary re-renders and flickering.
- 如果使用回呼函數更新子元件的狀態，將會導致子元件以新的狀態重新渲染。如果回呼函數在渲染之間發生變化，它將導致子元件以新狀態重新渲染，即使狀態實際上沒有改變。

- If the callback function is used to update the state of the child component, it will cause the child component to re-render with the new state. If the callback function changes between renders, it will cause the child component to re-render with the new state, even if the state has not actually changed.
- 透過確保回調函數在渲染之間保持相同的引用（只要其依賴項沒有更改）來防止子元件不必要的重新渲染。這可以透過
減少不必要的重新渲染和閃爍來幫助優化效能並改善使用者體驗


## Typescript - ! operator

- assert fields is not null or undefined
- Using the ! operator incorrectly can lead to runtime errors

```typescript
function printName(name: string | null): void {
  console.log(name!.toUpperCase());
}

printName(null); // throws an error
printName('john'); // logs JOHN
```


## Reference

- [App design in Figma](https://www.figma.com/design/jvcjzjCKw9YlhCNOIY1GPY/Horizon-Banking-App?node-id=8-1975)

