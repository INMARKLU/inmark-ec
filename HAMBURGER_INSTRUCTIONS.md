# Instrucciones para Claude Code — Menú hamburguesa móvil

## TAREA
Añadir menú hamburguesa responsive a TODOS los archivos HTML del proyecto.
Aplicar exactamente el mismo patrón en cada archivo sin modificar el diseño desktop.

---

## ARCHIVOS A MODIFICAR
- index.html
- servicios.html
- nosotros.html
- work.html
- conecta.html
- blog.html
- seo-ecuador.html
- automatizacion-ia-ecuador.html
- google-ads-ecuador.html
- desarrollo-web-ecuador.html
- como-posicionar-empresa-google-ecuador.html

---

## PASO 1 — CSS a añadir

Busca en cada archivo el bloque `@media(max-width:900px)` y AÑADE este CSS ANTES de ese bloque:

```css
/* ═══════════ HAMBURGUESA ═══════════ */
.hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;border-radius:8px;transition:background .25s;z-index:200;background:none;border:none}
.hamburger:hover{background:rgba(28,28,28,.06)}
.hamburger span{display:block;width:24px;height:2px;background:var(--ink);border-radius:2px;transition:transform .35s var(--ease),opacity .25s,width .3s}
.hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hamburger.open span:nth-child(2){opacity:0;width:0}
.hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}

.mobile-nav{position:fixed;inset:0;background:rgba(255,253,250,.98);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);z-index:150;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;opacity:0;pointer-events:none;transition:opacity .35s var(--ease),transform .35s var(--ease);transform:translateY(-12px)}
.mobile-nav.open{opacity:1;pointer-events:all;transform:none}
.mobile-nav a{font-size:clamp(28px,7vw,42px);font-weight:500;letter-spacing:-.025em;color:var(--ink);padding:8px 24px;border-radius:var(--radius-pill);transition:color .2s,background .2s;text-align:center}
.mobile-nav a:hover,.mobile-nav a.active{color:var(--primary)}
.mobile-nav .mobile-cta{margin-top:24px;padding:16px 32px;font-size:18px;border-radius:var(--radius-pill);background:var(--ink);color:#fff;font-weight:500;transition:background .25s,transform .25s}
.mobile-nav .mobile-cta:hover{background:var(--primary);transform:scale(1.03)}
.mobile-nav-footer{margin-top:32px;font-size:14px;color:var(--muted);text-align:center}
```

---

## PASO 2 — HTML del menú móvil

Dentro del `<header class="nav">`, busca el `</div>` que cierra el `.container` del nav y AÑADE justo antes:

```html
<button class="hamburger" id="hamburger" aria-label="Abrir menú" aria-expanded="false">
  <span></span>
  <span></span>
  <span></span>
</button>
```

Luego, JUSTO DESPUÉS del cierre `</header>`, añade:

```html
<!-- MENÚ MÓVIL -->
<nav class="mobile-nav" id="mobileNav" aria-label="Menú móvil">
  <a href="index.html">Inicio</a>
  <a href="servicios.html">Servicios</a>
  <a href="blog.html">Blog</a>
  <a href="work.html">Proyectos</a>
  <a href="nosotros.html">Quiénes somos</a>
  <a href="conecta.html">Contacto</a>
  <a href="conecta.html" class="mobile-cta">Auditoría gratuita →</a>
  <div class="mobile-nav-footer">hola@inmark.ec · +593 95 863 6022</div>
</nav>
```

IMPORTANTE: En la página activa, añade class="active" al enlace correspondiente.

---

## PASO 3 — CSS responsive a actualizar

Dentro del bloque `@media(max-width:900px)` de cada archivo, AÑADE estas líneas:

```css
.hamburger{display:flex}
nav.primary{display:none}
.nav-actions .btn{display:none}
```

---

## PASO 4 — JavaScript a añadir

Busca el bloque `<script>` al final de cada archivo y AÑADE este código al inicio del script:

```javascript
// Hamburguesa
(function(){
  const btn=document.getElementById('hamburger');
  const nav=document.getElementById('mobileNav');
  const links=nav.querySelectorAll('a');
  if(!btn||!nav)return;
  function toggle(open){
    btn.classList.toggle('open',open);
    nav.classList.toggle('open',open);
    btn.setAttribute('aria-expanded',open);
    document.body.style.overflow=open?'hidden':'';
  }
  btn.addEventListener('click',()=>toggle(!nav.classList.contains('open')));
  links.forEach(l=>l.addEventListener('click',()=>toggle(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false)});
})();
```

---

## REGLAS IMPORTANTES

1. NO modificar el diseño desktop — solo añadir elementos móviles
2. NO cambiar colores, tipografías ni estructura de secciones
3. Aplicar exactamente el mismo patrón en los 11 archivos
4. En cada página marcar el enlace correcto como active en el mobile-nav
5. NO tocar el CSS ni JS existente — solo añadir lo nuevo
