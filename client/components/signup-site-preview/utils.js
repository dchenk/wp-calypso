/** @format */

/**
 * Returns an object containing a font's weight and style parsed from fvd values.
 * See: client/lib/signup/site-styles.js
 * See: https://github.com/typekit/fvd
 *
 * @param  {Array} fvd Array of font variations in fvd format
 * @return {Object} Weight and style options
 */
export function fvdToFontWeightAndStyle( fvd ) {
	return {
		weight: fvd[ 1 ] + '00',
		style: fvd[ 0 ] === 'i' ? 'italic' : 'normal',
	};
}

/**
 * Returns a Google font CSS URI.
 *
 * @param  {Object} font A theme's font details: { name: '', variations: [], id: '' }
 * @return {String} The font CSS URI.
 */
export function getFontCssUri( font ) {
	const base = 'https://fonts.googleapis.com/css?family=';
	const variations = font.variations.reduce( ( result, variation ) => {
		const { weight, style } = fvdToFontWeightAndStyle( variation );
		const suffix = style === 'italic' ? 'italic' : '';
		result.push( weight + suffix );
		return result;
	}, [] );
	return `${ base }${ font.id }:${ variations.join( ',' ) }`;
}

/**
 * Returns a theme base CSS URI.
 *
 * @param  {String} themeSlug A theme slug, e.g., `pub/business`
 * @param  {Boolean} isRtl If the current locale is a right-to-left language
 * @return {String} The theme CSS URI.
 */
export function getThemeCssUri( themeSlug, isRtl ) {
	return `https://s0.wp.com/wp-content/themes/${ themeSlug }/style${ isRtl ? '-rtl' : '' }.css`;
}

/**
 * Returns a WordPress page shell HTML
 *
 * @param  {String} content The body content
 * @param  {Object} font A theme's font details: { name: '', variations: [], id: '' }
 * @param  {Boolean} isRtl If the current locale is a right-to-left language
 * @param  {String} langSlug The slug of the current locale
 * @param  {String} themeSlug A theme slug, e.g., `pub/business`
 * @return {String} The HTML source.
 */
export function getIframeSource( content, font, isRtl, langSlug, themeSlug ) {
	const source = `
		<html lang="${ langSlug }" dir="${ isRtl ? 'rtl' : 'ltr' }">
		<head>
			<title>${ content.title } – ${ content.tagline }</title>
			<link type="text/css" media="all" rel="stylesheet" href="https://s0.wp.com/wp-content/plugins/gutenberg-core/build/block-library/style.css" />
			<link type="text/css" media="all" rel="stylesheet" href="${ getThemeCssUri( themeSlug, isRtl ) }" />
			<link type="text/css" media="all" rel="stylesheet" href="${ getFontCssUri( font ) }" />
		</head>
		<body class="home page-template-default page logged-in">
			<div id="page" class="site">
				<div id="content" class="site-content">
					<section id="primary" class="content-area">
						<main id="main" class="site-main">
							<article className="post-2 page type-page status-publish hentry entry">
								<div className="entry-content">
									<div class="site-builder__header">
										<h1 class="site-builder__title">${ content.title }</h1>
										<h2 class="site-builder__description">${ content.tagline }</h2>
										${ content.body }
									</div>
								</div>
							</article>
						</div>
					</section>
				</div>
			</div>
		</body>
	</html>`;

	return URL.createObjectURL( new Blob( [ source ], { type: 'text/html' } ) );
}
