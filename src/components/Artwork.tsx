import { useId } from 'react'

export function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <svg
      className="brand-mark"
      width={small ? 30 : 36}
      height={small ? 33 : 39}
      viewBox="0 0 39 43"
      fill="none"
      aria-hidden="true"
    >
      <path d="m7 5 19-4 7 29-23 5z" fill="#203B5A" />
      <path d="m11 5 20 1 3 30-23-1z" fill="#A4B8D0" />
      <path d="M3 10.5a2 2 0 0 1 2-2h21l8 8v23a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#F16B4F" />
      <path d="M26 8.5v8h8" fill="#FFB6A3" />
      <path
        d="M10 20h12M10 25h17M10 30h12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Indian Flag Strip */}
      <rect x="6" y="34" width="27" height="2.2" fill="#FF9933" />
      <rect x="6" y="36.2" width="27" height="2.2" fill="#FFFFFF" />
      <rect x="6" y="38.4" width="27" height="2.2" fill="#138808" />
      <circle cx="19.5" cy="37.3" r="0.9" fill="#000080" />
    </svg>
  )
}

function Portrait({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect width="76" height="89" rx="1" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect width="76" height="89" fill="#DAE7F2" />
        <path d="M0 72 76 38v51H0z" fill="#D0DFED" />
        <path
          d="M3 97c1-23 6-31 21-35l13-4 14 4c16 4 22 14 25 35"
          fill="#536E91"
          stroke="#263D5B"
          strokeWidth="1.6"
        />
        <path d="m28 58 10 4 10-4-4 32H32z" fill="#F6F7F5" />
        <path d="M30 47h15v13l-7 7-8-7z" fill="#EAC1A2" stroke="#35465C" strokeWidth="1.3" />
        <path
          d="m29 58 9 8-7 9-8-12zm18 0-9 8 6 9 9-12z"
          fill="#F8F9F7"
          stroke="#35465C"
          strokeWidth="1.2"
        />
        <path
          d="m23 62 7 26-12-15 4-4-4-1zm30 1-8 25 13-15-5-4 5-1z"
          fill="#3D5679"
          stroke="#283F60"
          strokeWidth="1"
        />
        <path
          d="M20 26c0-14 8-22 20-21 13 1 20 9 17 25l-3 13c-3 10-10 15-17 14-6-1-13-7-15-16z"
          fill="#F4D5BC"
          stroke="#35465C"
          strokeWidth="1.6"
        />
        <path
          d="M21 31c-6-5-6 9 1 10m33-10c6-4 4 8-1 10"
          fill="#F4D5BC"
          stroke="#35465C"
          strokeWidth="1.4"
        />
        <path
          d="M19 32c-5-8-4-18 0-23 0-4 5-9 10-8 4-5 13-4 18 0 11-1 17 8 12 18l-4 14-3-15c-10 5-20 2-23-1-1 7-4 9-8 8v9z"
          fill="#263D5B"
        />
        <path
          d="M24 10c5-5 12-6 19-4M21 16c6-6 12-6 16-5"
          fill="none"
          stroke="#647A91"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="m27 31 6-1m11 0 6 1m-12 2-1 8 3 1m-6 6c3 2 6 2 9 0"
          fill="none"
          stroke="#6D6260"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <ellipse cx="31" cy="34" rx="1" ry="1.4" fill="#293B50" />
        <ellipse cx="46" cy="34" rx="1" ry="1.4" fill="#293B50" />
      </g>
    </g>
  )
}

export function HeroArtwork() {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      className="hero-art"
      viewBox="0 0 510 335"
      fill="none"
      role="img"
      aria-label="An illustrated application form, passport photo, and coral fountain pen"
    >
      <defs>
        <pattern
          id={`${id}-hatch`}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(35)"
        >
          <path d="M0 0v4" stroke="#8298B1" strokeWidth="1" />
        </pattern>
        <pattern id={`${id}-dots`} width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r=".65" fill="#A4B5C9" />
        </pattern>
      </defs>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M39 200c-25-6-30-28-16-40 19-16 35 1 23 13-12 12-37-6-32-28"
          stroke="#93A7BD"
          strokeWidth="1.5"
          strokeDasharray="3 5"
        />
        <path
          d="M377 65c26-26 60-23 71-6 8 13-1 28-12 24-11-5-4-25 15-24 18 1 26 14 28 28"
          stroke="#98AFC3"
          strokeWidth="1.4"
          strokeDasharray="4 5"
        />
        <path d="m472 82 7 7 4-9" stroke="#98AFC3" strokeWidth="1.4" />
        <g stroke="#9AAEC3" strokeWidth="1.4">
          <path d="M62 71h10m-5-5v10m360 137h9m-4.5-4.5v9M129 309h8m-4-4v8" />
        </g>
        <path d="m397 26 2-7 2 7 7 2-7 2-2 7-2-7-7-2z" fill="#EDAA83" />
        <circle cx="67" cy="247" r="3" fill="#EDAA83" />
        <circle cx="455" cy="153" r="2" fill="#A4B7CB" />
        <g className="paper-stack">
          <g transform="rotate(-9 259 171)">
            <rect
              x="158"
              y="45"
              width="188"
              height="259"
              rx="3"
              fill="#9CAFCA"
              opacity=".23"
              transform="translate(5 5)"
            />
            <rect
              x="158"
              y="45"
              width="188"
              height="259"
              rx="3"
              fill="#D4DFEA"
              stroke="#445F7C"
              strokeWidth="1.7"
            />
            <path d="M169 57h164v236H169z" fill={`url(#${id}-dots)`} />
            <path
              d="M175 70h87m-87 8h105m-105 8h57M174 271h130m-130 7h107"
              stroke="#8DA2BA"
              strokeWidth="2"
            />
          </g>
          <g transform="rotate(7 272 160)">
            <path
              d="M180 28h168l25 25v239H180z"
              fill="#8EA4BE"
              opacity=".25"
              transform="translate(5 5)"
            />
            <path
              d="M178 26h169l24 24v240H178z"
              fill="#FFFEF9"
              stroke="#304B69"
              strokeWidth="1.8"
            />
            <path d="m347 26 1 25 23-1z" fill="#DBE5ED" stroke="#304B69" strokeWidth="1.5" />
            <path d="M193 44h48" stroke="#E88063" strokeWidth="4" />
            <text
              x="193"
              y="69"
              fill="#29435E"
              fontFamily="Arial, sans-serif"
              fontSize="14"
              fontWeight="800"
              letterSpacing=".3"
            >
              APPLICATION FORM
            </text>
            <path d="M194 80h146" stroke="#93A3B1" strokeWidth="1.4" />
            <text
              x="194"
              y="97"
              fill="#77899A"
              fontFamily="Arial, sans-serif"
              fontSize="5.7"
              fontWeight="700"
              letterSpacing="1.1"
            >
              PERSONAL DETAILS
            </text>
            <path
              d="M194 108h26m22 0h93m-141 13h18m30 0h78m-126 14h28m20 0h91"
              stroke="#9AAABA"
              strokeWidth="2.7"
            />
            <path d="M193 149h160" stroke="#ADBBC5" />
            <g stroke="#536E88" strokeWidth="1.3">
              <rect x="195" y="162" width="10" height="10" rx="1" />
              <rect x="195" y="184" width="10" height="10" rx="1" />
              <rect x="195" y="206" width="10" height="10" rx="1" />
            </g>
            <g stroke="#426B67" strokeWidth="2">
              <path d="m197 166 3 3 7-9m-10 28 3 3 7-9m-10 28 3 3 7-9" />
            </g>
            <g stroke="#A4B0BD" strokeWidth="2.4">
              <path d="M216 164h80m-80 6h54m-54 16h112m-112 6h67m-67 16h87m-87 6h49" />
            </g>
            <path d="M193 230h160" stroke="#BFCCD4" />
            <path
              d="M264 259c9-7 19-29 14-27s-10 31-3 26 14-25 11-19-7 24-2 19 9-16 9-11-2 11 2 7 6-7 6-3 7-2 13-3m-43 15 56-9"
              stroke="#3D536F"
              strokeWidth="1.7"
            />
            <path d="M253 268h91" stroke="#9DABB7" />
            <text
              x="253"
              y="278"
              fill="#82909E"
              fontSize="5"
              fontFamily="Arial, sans-serif"
              letterSpacing="1"
            >
              APPLICANT SIGNATURE
            </text>
          </g>
          <g transform="rotate(7 219 37)">
            <path
              d="M212 52V21c0-12 16-12 16 0v34c0 8-10 8-10 0V25"
              stroke="#784D4B"
              strokeWidth="4"
            />
            <path
              d="M211 51V20c0-12 16-12 16 0v34c0 8-10 8-10 0V24"
              stroke="#F58B6C"
              strokeWidth="2.7"
            />
          </g>
        </g>
        <g className="portrait-card" transform="rotate(-11 131 210)">
          <rect
            x="81"
            y="140"
            width="106"
            height="139"
            rx="3"
            fill="#6E88A6"
            opacity=".22"
            transform="translate(5 6)"
          />
          <rect
            x="81"
            y="140"
            width="106"
            height="139"
            rx="3"
            fill="#FFFEFA"
            stroke="#344F6B"
            strokeWidth="1.8"
          />
          <g transform="translate(89 148) scale(1.18)">
            <Portrait id={`${id}-portrait`} />
          </g>
          <path d="M89 148h90v105H89z" stroke="#6F859C" strokeWidth="1" />
          <text
            x="134"
            y="267"
            fill="#63798D"
            fontFamily="Arial, sans-serif"
            fontSize="6.5"
            fontWeight="700"
            textAnchor="middle"
            letterSpacing="1.4"
          >
            PASSPORT PHOTO
          </text>
        </g>
        <g className="hero-pen" transform="rotate(38 367 220)">
          <path
            d="M362 131c0-9 13-9 13 0v123l-7 35-6-35z"
            fill="#7388A3"
            opacity=".22"
            transform="translate(5 5)"
          />
          <path
            d="M360 132c0-10 15-10 15 0v41h-15z"
            fill="#E97A5D"
            stroke="#304761"
            strokeWidth="1.7"
          />
          <path d="M358 132h19v6h-19z" fill="#304761" />
          <path d="M373 133h5v49c0 3-4 4-4 0z" fill="#D9E3E9" stroke="#304761" strokeWidth="1.4" />
          <path
            d="M360 141h14v104l-3 11h-8l-3-11z"
            fill="#F58B6A"
            stroke="#304761"
            strokeWidth="1.6"
          />
          <path d="M363 144v96" stroke="#FFBEA1" strokeWidth="2.3" />
          <path d="M360 238h14v7h-14z" fill="#F6CA97" stroke="#304761" strokeWidth="1.3" />
          <path d="m361 246 2 14h8l2-14z" fill="#2D4865" stroke="#304761" />
          <path d="m363 259 4 24 5-24z" fill="#E4E8E4" stroke="#304761" strokeWidth="1.4" />
          <path d="m367 283 1-14" stroke="#304761" />
          <circle cx="368" cy="267" r="1.3" fill="#304761" />
        </g>
        <path
          d="M291 303c-16 8-27 11-40 11"
          stroke="#8EA1B8"
          strokeWidth="1.25"
          strokeDasharray="3 4"
        />
        <path d="M404 264h15m-7.5-7.5v15" stroke="#8EA1B8" />
        <circle cx="411.5" cy="264" r="5" stroke="#B8C6D7" />
      </g>
    </svg>
  )
}

export type ToolId = 'resizer' | 'compressor' | 'scanner' | 'age' | 'jpg-to-pdf' | 'pdf-to-jpg'

export function ToolArtwork({ tool }: { tool: ToolId }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      className={`tool-art artwork-${tool}`}
      viewBox="0 0 200 118"
      fill="none"
      aria-hidden="true"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {(tool === 'jpg-to-pdf' || tool === 'pdf-to-jpg') && (
        <g>
          <g transform={tool === 'jpg-to-pdf' ? 'translate(0 0)' : 'translate(47 -1)'}>
            <g transform="rotate(-13 76 62)">
              <rect
                x="37"
                y="28"
                width="66"
                height="69"
                rx="3"
                fill="#BDCFCD"
                stroke="#597F7E"
                strokeWidth="1.5"
              />
              <rect
                x="43"
                y="20"
                width="66"
                height="69"
                rx="3"
                fill="#FFFEF9"
                stroke="#416A70"
                strokeWidth="1.7"
              />
              <path d="M49 27h54v42H49z" fill="#D6E8E9" stroke="#73989D" />
              <circle cx="89" cy="38" r="5" fill="#E9BC8D" />
              <path d="m49 61 18-18 14 14 8-9 14 15v6H49z" fill="#8EAEA4" />
              <path d="m49 65 16-13 15 8 12-7 11 9v7H49z" fill="#5F8785" />
              <path d="M51 78h30m6 0h12" stroke="#A6B9B9" strokeWidth="2" />
            </g>
          </g>
          <g
            transform={
              tool === 'jpg-to-pdf' ? 'rotate(7 125 65)' : 'translate(-64 -11) rotate(-7 125 65)'
            }
          >
            <path d="M103 34h35l13 13v53h-48z" fill="#FFFCF5" stroke="#886D57" strokeWidth="1.7" />
            <path d="m138 34 1 14 12-1z" fill="#E8D6C5" stroke="#886D57" strokeWidth="1.4" />
            <rect
              x="97"
              y="54"
              width="35"
              height="18"
              rx="2"
              fill="#DD9374"
              stroke="#9F7057"
              strokeWidth="1.3"
            />
            <text
              x="114.5"
              y="67"
              fill="white"
              fontFamily="Arial, sans-serif"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              PDF
            </text>
            <path d="M111 80h29m-29 6h23m-23 6h15" stroke="#BDAB9B" strokeWidth="2" />
          </g>
          <path d="M105 21c13-8 29-4 35 7m-8-3 8 4 1-9" stroke="#708991" strokeWidth="1.7" />
          <path d="M29 58h7m-3.5-3.5v7m119 14h7m-3.5-3.5v7" stroke="#A5B8B6" strokeWidth="1.3" />
        </g>
      )}
      {tool === 'resizer' && (
        <g>
          <g transform="rotate(8 95 61)">
            <rect
              x="61"
              y="21"
              width="70"
              height="83"
              rx="3"
              fill="#B6CDE8"
              stroke="#526E91"
              strokeWidth="1.5"
            />
            <path d="M69 31h52v57H69z" stroke="#8DAAC9" />
          </g>
          <g transform="rotate(-9 89 58)">
            <rect
              x="52"
              y="12"
              width="69"
              height="88"
              rx="3"
              fill="#FDFEFD"
              stroke="#354F73"
              strokeWidth="1.8"
            />
            <g transform="translate(58 18) scale(.75)">
              <Portrait id={`${id}-mini`} />
            </g>
            <path d="M60 90h34m5 0h14" stroke="#8C9FB4" strokeWidth="2" />
          </g>
          <g transform="rotate(-34 131 81)">
            <rect
              x="89"
              y="73"
              width="83"
              height="17"
              rx="2"
              fill="#B4D0F2"
              stroke="#36577D"
              strokeWidth="1.7"
            />
            <path
              d="M96 73v8m7-8v5m7-5v8m7-8v5m7-5v8m7-8v5m7-5v8m7-8v5m7-5v8m7-8v5"
              stroke="#56799E"
              strokeWidth="1.4"
            />
          </g>
          <path d="M35 46v-9h9m88-16h9v9" stroke="#84A2C6" strokeWidth="1.5" />
          <path d="m153 49 2-4 1 4 4 1-4 1-1 4-2-4-4-1z" fill="#8BA8CE" />
        </g>
      )}
      {tool === 'compressor' && (
        <g>
          <g transform="rotate(-9 88 59)">
            <path d="M56 22h62v79H56z" fill="#F4C9BA" stroke="#9F6757" strokeWidth="1.5" />
            <path d="M62 29h48v65H62z" fill="#FCE9DE" stroke="#C7917A" />
          </g>
          <g transform="rotate(7 100 60)">
            <path d="M68 12h48l17 17v73H68z" fill="#FFFDF7" stroke="#79564A" strokeWidth="1.8" />
            <path d="m116 12 1 18 16-1z" fill="#EBD7CA" stroke="#79564A" strokeWidth="1.5" />
            <path d="M79 57h41M79 65h34m-34 8h41m-41 8h27" stroke="#CBB7AC" strokeWidth="2.7" />
            <rect
              x="58"
              y="31"
              width="45"
              height="23"
              rx="3"
              fill="#E98268"
              stroke="#9F5D4B"
              strokeWidth="1.4"
            />
            <text
              x="80"
              y="47.5"
              fill="white"
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fontFamily="Arial, sans-serif"
            >
              PDF
            </text>
          </g>
          <g transform="rotate(6 140 83)">
            <rect
              x="122"
              y="69"
              width="36"
              height="32"
              rx="6"
              fill="#F6C7B5"
              stroke="#926653"
              strokeWidth="1.6"
            />
            <path
              d="m128 75 9 8m-1-7 1 7-7-1m21 13-9-9m7 0-7 0 1 7"
              stroke="#86513E"
              strokeWidth="2"
            />
          </g>
          <path d="m42 63 3-5 1 5 5 1-5 1-1 5-3-5-4-1z" fill="#DAA48C" />
          <path d="M148 29h7m-3.5-3.5v7" stroke="#D7A390" />
        </g>
      )}
      {tool === 'scanner' && (
        <g>
          <g transform="rotate(6 101 58)">
            <rect
              x="67"
              y="19"
              width="68"
              height="84"
              rx="2"
              fill="#B6D5CB"
              stroke="#577C71"
              strokeWidth="1.5"
            />
            <path d="M62 11h54l15 16v71H62z" fill="#FFFDF6" stroke="#3E655D" strokeWidth="1.7" />
            <path d="m116 11 1 17 14-1" fill="#D6E8DE" stroke="#3E655D" strokeWidth="1.4" />
            <path d="M75 26h26" stroke="#52796E" strokeWidth="3.2" />
            <path
              d="M75 38h40m-40 7h29m-29 23h39m-39 7h33m-33 7h20"
              stroke="#A5B9AE"
              strokeWidth="2.5"
            />
          </g>
          <path
            d="M48 34V22h15m70 0h16v13M48 82v13h15m70 0h16V82"
            stroke="#4B8E7A"
            strokeWidth="3.4"
          />
          <path d="M46 51h105v12H46z" fill="#9DD0BA" opacity=".48" />
          <path d="M43 59h111" stroke="#4D977B" strokeWidth="3" />
          <path d="m149 8 2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#F7FDF8" stroke="#72A48D" />
          <path d="M38 69h6m-3-3v6" stroke="#98BBAA" />
        </g>
      )}
      {tool === 'age' && (
        <g>
          <g transform="rotate(-6 96 58)">
            <rect
              x="54"
              y="27"
              width="91"
              height="75"
              rx="5"
              fill="#C9BFDC"
              stroke="#796A90"
              strokeWidth="1.6"
            />
            <rect
              x="51"
              y="21"
              width="91"
              height="75"
              rx="5"
              fill="#FFFDFB"
              stroke="#68587E"
              strokeWidth="1.8"
            />
            <path
              d="M56 21h81q5 0 5 5v15H51V26q0-5 5-5"
              fill="#AE9BC8"
              stroke="#68587E"
              strokeWidth="1.6"
            />
            <path d="M69 15v13m19-13v13m19-13v13m19-13v13" stroke="#68587E" strokeWidth="4" />
            <path d="M69 14v12m19-12v12m19-12v12m19-12v12" stroke="#E4DFEA" strokeWidth="1.5" />
            {[0, 1, 2].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={62 + col * 20}
                  y={49 + row * 14}
                  width="9"
                  height="6"
                  rx="1"
                  fill={row === 1 && col === 1 ? '#A28CBF' : '#D8D2E3'}
                />
              )),
            )}
          </g>
          <circle cx="139" cy="85" r="20" fill="#DBD2E9" stroke="#78678D" strokeWidth="1.7" />
          <path d="m129 85 7 7 13-15" stroke="#77618E" strokeWidth="3.6" />
          <path d="M155 32h8m-4-4v8M36 63h7m-3.5-3.5v7" stroke="#AD9ABD" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  )
}
