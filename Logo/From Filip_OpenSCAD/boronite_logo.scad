//PARAMETERS
outer_d = 104;

line_dim = [48,6];
middle_line_offset = [-70, 0];
upper_line_offset = [-51, 39.375];
lower_line_offset = [upper_line_offset[0], -upper_line_offset[1]];

outer_hole_d = 84;
outer_hole_offset = [-(outer_d - outer_hole_d)/2 - 0.01, 0];

inner_d = 70;
inner_offset = [-10.5, 0];

inner_hole_d = 33;

//MODULES
module hexagon(d) circle(d = d, $fn = 6);

module line() square(line_dim, center = true);


//OBJECTS
difference() {
	union() {
		hexagon(d = outer_d);
		translate(middle_line_offset) line();
		translate(upper_line_offset) line();
		translate(lower_line_offset) line();
	}
	difference() {
		translate(outer_hole_offset) hexagon(d = outer_hole_d);
		difference() {
			translate(inner_offset) hexagon(d = inner_d);
			hexagon(d = inner_hole_d);
		}
	}
}