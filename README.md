Time Series Demo for FCC Fedex Day (March 11-12, 2013)
=======

<h2>Goals:</h2>

- Explore the capabilities of the JS charting/graphing libraries HighStock and Rickshaw
- Implement a publicly available API that provides stock data or other times series data
- Investigate other time series libraries (time permitting)


<h3>Criteria for choosing a library:</h3>

- Is it open source (or at least free to try)?
- Does the library have good documentation, community support, and currently maintained?
- What are the ‘out of the box’ features?
- How easy is it to learn and customize?


<h3>Libraries and API's were used to create the demos:</h3>

- jQuery v1.8.3
- Bootstrap v2.3.1
- HighStock v1.2.5 
- Markit On Demand - Company Lookup API
- Markit On Demand - Stock Quote API

<h3>Demos</h3>
All of the demos display a chart of historical data based on an entered stock symbol and number of days.

<a href="http://vizui.github.io/ts-demo/rs-line.html">rs-line.html</a> - uses Ricksaw<br>
<a href="http://vizui.github.io/ts-demo/hs-compare-multi.html">hs-compare-multi.html</a> - uses HighStock<br>
<a href="http://vizui.github.io/ts-demo/hs-compare-multi-co.html">hs-compare-multi-co.html</a> - uses HighStock

<h3>Results</h3>
Rickshaw looked promising since it uses d3 that can be accessed through functions without having to know <a href="http://d3js.org/">d3</a> specifics. HighStock can produce SVG based charts and is the clear winner for getting a feature rich chart up and running in the least amount of time but it requires a paid license.
<table><thead><tr>
        	<th>&nbsp;</th>
            <th>Pros</th>
            <th>Cons</th>
        </tr>
    </thead>
    <tbody>
    	<tr>
        	<td><a href="http://code.shutterstock.com/rickshaw/examples/">Rickshaw (built by Shutterstock)</a></td>
            <td>- Built on D3<br> - Can be highly customized<br> - Open Source</td>
            <td>- Sparse documentation<br> - Learning curve<br> -	Lots of code for little return</td>
        </tr>
        <tr>
          <td><a href="http://www.highcharts.com/products/highstock">HighStock</a></td>
            <td>- Easy to setup and configure<br> - Feature rich<br>- Well supported and documented</td>
            <td style="vertical-align: top;">- Requires paid license<br> - Library is catered only for time series</td>
        </tr>
    </tbody>
</table>
