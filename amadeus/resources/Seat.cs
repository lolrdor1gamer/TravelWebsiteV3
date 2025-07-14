﻿using System;
using System.Collections.Generic;
using System.Text;

namespace amadeus.resources
{
    /// <summary>
    /// An Seat object.
    /// </summary>
    public class Seat
    {
        internal Seat() { }

        /// <summary>
        /// Gets or sets the type of the number.
        /// </summary>
        /// <value>The type of the number.</value>
        public string number { get; set; }

        /// <summary>
        /// Gets or sets the type of the cabin.
        /// </summary>
        /// <value>The type of the cabin.</value>
        public string cabin { get; set; }

        /// <summary>
        /// Gets or sets the type of the associationRefs.
        /// </summary>
        /// <value>The type of the associationRefs.</value>
        public List<AssociationRef> associationRefs { get; set; }

        /// <summary>
        /// Gets or sets the type of the characteristicsCodes.
        /// </summary>
        /// <value>The type of the characteristicsCodes.</value>
        public List<string> characteristicsCodes { get; set; }

        /// <summary>
        /// Gets or sets the type of the travelerPricing.
        /// </summary>
        /// <value>The type of the travelerPricing.</value>
        public List<SeatmapTravelerPricing> travelerPricing { get; set; }

        /// <summary>
        /// Gets or sets the type of the coordinates.
        /// </summary>
        /// <value>The type of the coordinates.</value>
        public Coordinates coordinates { get; set; }
    }
}
