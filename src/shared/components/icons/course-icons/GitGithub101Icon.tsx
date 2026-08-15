import type { SVGProps } from 'react';

/**
 * Git & GitHub 101 course icon.
 *
 * Vector-traced from the original artwork so it renders crisply at any
 * size with no network request. Uses `fill="currentColor"` so it inherits
 * the surrounding text color — pass a Tailwind color class (e.g.
 * `className="text-accent"` or `className="text-text-primary"`) and it
 * will automatically follow the site's light/dark theme.
 */
export function GitGithub101Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1254 1254"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g transform="translate(0.000000,1254.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
        <path d="M5772 10864 c-146 -39 -250 -122 -312 -248 -62 -128 -70 -239 -25 -367 39 -109 123 -201 236 -256 l66 -32 -1 -779 c-1 -429 -3 -782 -6 -784 -3 -2 -31 -16 -64 -32 -176 -89 -285 -296 -256 -486 23 -145 127 -285 258 -346 l62 -29 1 -45 c4 -259 7 -3099 2 -3142 -5 -52 -8 -58 -37 -69 -50 -20 -148 -93 -184 -138 -69 -86 -121 -252 -107 -339 29 -172 117 -297 260 -368 l69 -35 1 -416 0 -415 -60 -29 c-98 -46 -168 -117 -218 -217 l-42 -87 0 -116 c0 -113 1 -116 38 -191 48 -97 118 -167 217 -216 72 -36 76 -37 190 -37 114 0 117 1 193 38 105 52 177 123 225 224 36 76 37 81 37 194 0 113 -1 116 -38 191 -45 92 -132 177 -224 221 l-63 29 0 413 0 414 72 38 c130 68 220 182 250 315 6 29 12 54 13 56 1 1 49 14 106 28 292 70 541 189 759 365 364 292 591 705 641 1164 l13 115 43 16 c96 37 195 134 244 239 104 222 7 489 -217 597 l-69 34 -7 86 c-58 767 -630 1406 -1418 1583 l-95 21 -25 75 c-26 78 -97 181 -149 219 -16 11 -56 34 -89 50 l-60 30 -7 62 c-3 35 -5 387 -3 783 l3 720 59 30 c75 37 174 128 208 192 45 83 61 155 56 258 -3 82 -8 101 -41 167 -65 132 -182 223 -324 253 -83 18 -113 18 -181 -1z m708 -3140 c150 -44 373 -156 500 -250 343 -257 568 -653 597 -1053 l6 -89 -63 -32 c-344 -174 -349 -662 -8 -823 79 -37 77 -31 53 -192 -46 -304 -198 -588 -442 -826 -196 -191 -451 -333 -721 -400 l-117 -29 -15 21 c-51 72 -139 152 -199 181 -36 18 -69 37 -73 43 -9 12 -10 3198 -1 3221 3 8 33 29 67 46 67 34 169 131 201 191 19 36 21 38 60 31 22 -3 92 -21 155 -40z" />
      </g>
    </svg>
  );
}

export default GitGithub101Icon;
