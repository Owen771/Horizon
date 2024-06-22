## Next.js 

- By default, all components in Next js is a server components, unless specify otherwise

Feature

- SSR (server side rendering)
- Route groups
- nested layout
- server action
- more advance & reusable form management by ts, react hook form, zod


## Shadcn ui benefits

1. As an ui library, it allows dev can only add the component that they wanna use, instead of adding the whole ui library into the project (like material UI or bootstrap..)

```
├── components
│   ├── ui
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...
```


## Files

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


## Reference

- [App design in Figma](https://www.figma.com/design/jvcjzjCKw9YlhCNOIY1GPY/Horizon-Banking-App?node-id=8-1975)

