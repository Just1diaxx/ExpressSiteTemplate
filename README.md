# ExpressSiteTemplate

**How to use EJS**

EJS is the acronym of Embedded JavaScript template.

So, you can run JavaScript directly in the web page.

EJS uses the same codebase of HTML.

Let's see an example:

```js

router.get((req, res) => {
    res.render('admin', {user: req.session.user})
})
```

And with our admin.ejs file... :

```html

<% if !(user && user.isAdmin) {%>
    <h1>Access denied.</h1>
<% } else { %>
    <h1>Admin page>
    <button>Stop server (very dangerous !!)</button>
<% } %>
```