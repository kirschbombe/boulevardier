<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="tei"
    version="1.0">

    <xsl:output method="text"/>

    <xsl:variable name="placeholder" select="'%s'"/>
    <xsl:variable name="space"       select="' '"/>
    <xsl:variable name="quote">"</xsl:variable>
    <xsl:variable name="quote-esc"   select="concat('\', $quote)"/>

    <xsl:variable name="template">
<xsl:text>
{ "type"       : "Feature"
, "geometry"   : { "type"         : "Point"
                 , "coordinates"  : [%s, %s]
                 }
, "properties" : { "markername" : "%s"
                 , "text"       : "%s"
                 , "layer"      : "%s"
                 }
}
</xsl:text>
    </xsl:variable>

    <xsl:variable name="mapmarker" select="//tei:note[@type='mapmarker']"/>
    <xsl:variable name="params" select="'latitude longitude name text layer'"/>

    <xsl:template name="lookup">
         <xsl:param name="property"/>
         <xsl:variable name="result">
             <xsl:choose>
                 <xsl:when test="$property = 'latitude'"  ><xsl:value-of select="substring-before($mapmarker/tei:geo, $space)" /></xsl:when>
                 <xsl:when test="$property = 'longitude'" ><xsl:value-of select="substring-after ($mapmarker/tei:geo, $space)" /></xsl:when>
                 <xsl:when test="$property = 'name'"      ><xsl:value-of select="$mapmarker/tei:placeName"                     /></xsl:when>
                 <xsl:when test="$property = 'text'"      ><xsl:value-of select="$mapmarker/tei:p"                             /></xsl:when>
                 <xsl:when test="$property = 'layer'"     ><xsl:value-of select="$mapmarker/tei:placeName/@type"               /></xsl:when>
                 <xsl:otherwise>
                     <xsl:message terminate="yes">
                         <xsl:value-of select="concat('Unhandled mapmarker property: ', $property)"/>
                     </xsl:message>
                 </xsl:otherwise>
             </xsl:choose>
         </xsl:variable>
         <xsl:call-template name="json-string">
             <xsl:with-param name="str" select="$result"/>
         </xsl:call-template>
    </xsl:template>

    <!-- output json -->
    <xsl:template match="/">
        <xsl:call-template name="sprintf">
            <xsl:with-param name="params"   select="$params"/>
            <xsl:with-param name="template" select="$template"/>
        </xsl:call-template>
    </xsl:template>

    <xsl:template name="sprintf">
        <xsl:param name="params"/>
        <xsl:param name="template"/>

        <xsl:choose>
            <xsl:when test="string-length($params) = 0 or
                            not(contains($template,$placeholder))">
                    <xsl:value-of select="$template"/>
            </xsl:when>

            <xsl:otherwise>
                <xsl:variable name="arg">
                    <xsl:variable name="param">
                        <xsl:choose>
                            <xsl:when test="contains($params, $space)">
                                <xsl:value-of select="substring-before($params, $space)"/>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="$params"/>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>
                    <xsl:call-template name="lookup">
                        <xsl:with-param name="mapmarker" select="$mapmarker"/>
                        <xsl:with-param name="property" select="$param"/>
                    </xsl:call-template>
                </xsl:variable>

                <xsl:variable name="rest">
                    <xsl:choose>
                        <xsl:when test="contains($params, $space)">
                            <xsl:value-of select="substring-after($params, $space)"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="''"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>

                <xsl:variable name="formatted">
                    <xsl:variable name="pfx" select="substring-before($template,$placeholder)"/>
                    <xsl:variable name="sfx" select="substring-after ($template,$placeholder)"/>
                    <xsl:value-of select="concat($pfx,$arg,$sfx)"/>
                </xsl:variable>

                <xsl:call-template name="sprintf">
                    <xsl:with-param name="mapmarker" select="$mapmarker"/>
                    <xsl:with-param name="params"    select="$rest"/>
                    <xsl:with-param name="template"  select="$formatted"/>
                </xsl:call-template>

            </xsl:otherwise>
        </xsl:choose>

    </xsl:template>

    <xsl:template name="json-string">
        <xsl:param name="str"/>
        <xsl:call-template name="replace">
            <xsl:with-param name="str" select="$str"/>
            <xsl:with-param name="find" select="$quote"/>
            <xsl:with-param name="replace" select="$quote-esc"/>
        </xsl:call-template>
    </xsl:template>

    <xsl:template name="replace">
        <xsl:param name="str"/>
        <xsl:param name="find"/>
        <xsl:param name="replace"/>
        <xsl:choose>
            <xsl:when test="not(contains($str,$find))">
                <xsl:value-of select="$str"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:variable name="pfx" select="substring-before($str,$find)"/>
                <xsl:variable name="sfx">
                    <xsl:call-template name="replace">
                        <xsl:with-param name="str" select="substring-after($str,$find)"/>
                        <xsl:with-param name="find" select="$find"/>
                        <xsl:with-param name="replace" select="$replace"/>
                    </xsl:call-template>
                </xsl:variable>
                <xsl:value-of select="concat($pfx,$replace,$sfx)"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

</xsl:stylesheet>